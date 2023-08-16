package hello;

import org.joda.time.LocalTime;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.Bucket;

import java.util.List;

public class HelloWorld {
  
  public static void wait(int ms)
  {
      try
      {
          Thread.sleep(ms);
      }
      catch(InterruptedException ex)
      {
          Thread.currentThread().interrupt();
      }
  }  
  

  public static void main(String[] args) {
      LocalTime currentTime = new LocalTime();
      System.out.println("The current local time is: " + currentTime);
      Greeter greeter = new Greeter();
      System.out.println(greeter.sayHello());   
       
      final AmazonS3 s3 = AmazonS3ClientBuilder.standard().withRegion(Regions.DEFAULT_REGION).build();
      List<Bucket> buckets = s3.listBuckets();
      System.out.println("Your Amazon S3 buckets are:");
      for (Bucket b : buckets) {
          System.out.println("* " + b.getName());
      }
      System.out.println("Going to sleep for a while...");
      long start = System.currentTimeMillis();
      wait(100000);
      System.out.println("Sleep time in ms = " + (System.currentTimeMillis() - start));
      System.out.println("Done!!!");      
    } 

}